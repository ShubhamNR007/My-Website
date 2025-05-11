import type { CardListData } from 'astro-pure/types'

// portswigger-labs content declaration
export const docs: CardListData = {
  title: 'portswigger-labs content',
  list: [
    {
      title: 'Setup',
      children: [
        { title: 'Getting Started', link: '/portswigger-labs/setup/getting-started' },
        { title: 'Configuration', link: '/portswigger-labs/setup/configuration' },
        { title: 'Authoring Content', link: '/portswigger-labs/setup/content' },
        { title: 'Deployment', link: '/portswigger-labs/setup/deployment' }
      ]
    },
    {
      title: 'Integrations',
      children: [
        { title: 'Comment System', link: '/portswigger-labs/integrations/comment' },
        { title: 'Friend Links', link: '/portswigger-labs/integrations/links' },
        { title: 'Shiki Code', link: '/portswigger-labs/integrations/code' },
        { title: 'User Components', link: '/portswigger-labs/integrations/components' },
        { title: 'Advanced Components', link: '/portswigger-labs/integrations/advanced' },
        { title: 'Other Integrations', link: '/portswigger-labs/integrations/others' }
      ]
    },
    {
      title: 'Advanced',
      children: [
        { title: 'Update Theme', link: '/portswigger-labs/advanced/update' },
        { title: 'Optimize Your Site', link: '/portswigger-labs/advanced/optimize' },
        { title: 'Acknowledgements', link: '/portswigger-labs/advanced/thanks' }
      ]
    }
  ]
}
