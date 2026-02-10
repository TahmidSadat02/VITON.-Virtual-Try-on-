import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photoUrl, dressUrl } = await request.json()

    if (!photoUrl || !dressUrl) {
      return NextResponse.json(
        { error: 'Missing photoUrl or dressUrl' },
        { status: 400 }
      )
    }

    const AI_API_KEY = process.env.AI_API_KEY
    const AI_API_URL = process.env.AI_API_URL

    if (!AI_API_KEY || !AI_API_URL) {
      console.error('AI configuration missing')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    console.log('Calling Hugging Face API:', AI_API_URL)
    console.log('With images:', { photoUrl, dressUrl })

    // IDM-VTON expects image URLs in a specific format
    // Try the gradio client format
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          "image": photoUrl,  // person image
          "mask_image": dressUrl,  // garment image
        },
      }),
    })

    console.log('Hugging Face response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', response.status, errorText)
      
      // If model is loading, return a helpful message
      if (response.status === 503) {
        return NextResponse.json({
          error: 'AI model is loading. Please try again in 20-30 seconds.',
          isLoading: true
        }, { status: 503 })
      }
      
      // Return detailed error instead of fallback
      return NextResponse.json({
        error: `Hugging Face API failed: ${errorText.substring(0, 200)}`,
        status: response.status
      }, { status: response.status })
    }

    // Get the result image
    const blob = await response.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    // Upload result to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-result.png`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tryon-results')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('tryon-results')
      .getPublicUrl(fileName)

    console.log('Try-on result uploaded:', publicUrl)
    return NextResponse.json({ resultUrl: publicUrl })
    
  } catch (error: any) {
    console.error('Try-on API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process try-on' },
      { status: 500 }
    )
  }
}
