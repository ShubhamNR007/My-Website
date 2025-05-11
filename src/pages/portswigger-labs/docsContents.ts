import type { CardListData } from 'astro-pure/types'

// portswigger-labs content declaration
export const docs: CardListData = {
  title: 'portswigger-labs content',
  list: [
    {
      title: 'API Testing',
      children: [
        { title: 'Exploiting server-side parameter pollution in a REST URL', link: '/portswigger-labs/api/api5' }
      ]
    }
  ]
}
