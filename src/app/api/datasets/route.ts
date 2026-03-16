import { NextRequest, NextResponse } from 'next/server'

import { datasets, site } from '@vizualni/datagov-client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || undefined
  // Validate and clamp pagination parameters to prevent abuse
  const page = Math.max(1, Math.min(1000, parseInt(searchParams.get('page') || '1') || 1))
  const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '20') || 20))
  const type = searchParams.get('type') // 'featured' or 'recent'

  try {
    let result

    if (type === 'featured') {
      const datasetsList = await site.homeDatasets()
      result = {
        datasets: datasetsList,
        total: datasetsList.length,
        page: 1,
        page_size: datasetsList.length,
      }
    } else if (type === 'recent') {
      const response = await datasets.list({
        page: 1,
        page_size: pageSize,
        sort: '-created',
      })
      result = {
        datasets: response.data,
        total: response.total,
        page: response.page,
        page_size: response.page_size,
      }
    } else {
      const response = await datasets.list({
        q: query,
        page,
        page_size: pageSize,
      })

      result = {
        datasets: response.data,
        total: response.total,
        page: response.page,
        page_size: response.page_size,
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}
