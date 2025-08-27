import type { CardListData } from 'astro-pure/types'

// portswigger-labs content declaration
export const docs: CardListData = {
  title: 'portswigger-labs content',
  list: [
    {
      title: 'API Testing',
      children: [
        { title: 'Exploiting an API endpoint using documentation', link: '/portswigger-labs/api/api1' },
        { title: 'Exploiting server-side parameter pollution in a query string', link: '/portswigger-labs/api/api2' },
        { title: 'Exploiting server-side parameter pollution in a REST URL', link: '/portswigger-labs/api/api5' }
      ]
    },
    {
      title: 'JWT Testing',
      children: [
        { title: 'JWT Authentication Bypass via Unverified Signature', link: '/portswigger-labs/jwt/jwt1' },
        { title: 'JWT Authentication Bypass via "alg: none"', link: '/portswigger-labs/jwt/jwt2' }
      ]
    },
    {
      title: 'SQL Injection',
      children: [
        { title: 'SQL Injection in WHERE Clause Reveals Hidden Products', link: '/portswigger-labs/sqli/sqli1' },
        { title: 'SQL injection vulnerability allowing login bypass', link: '/portswigger-labs/sqli/sqli2' },
        { title: 'SQL injection attack, querying the database type and version on Oracle', link: '/portswigger-labs/sqli/sqli3' },
        { title: 'SQL Injection: Extracting Database Type and Version', link: '/portswigger-labs/sqli/sqli4' },
        { title: 'SQL Injection Attack — Listing Database Contents on Non-Oracle Databases', link: '/portswigger-labs/sqli/sqli5' }
      ]
    }
  ]
}
