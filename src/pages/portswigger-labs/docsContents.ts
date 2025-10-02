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
        { title: 'Finding and exploiting an unused API endpoint', link: '/portswigger-labs/api/api3' },
        { title: 'Exploiting a mass assignment vulnerability', link: '/portswigger-labs/api/api4' },
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
        { title: 'SQL Injection Attack — Listing Database Contents on Non-Oracle Databases', link: '/portswigger-labs/sqli/sqli5' },
        { title: 'SQL injection attack, listing the database contents on Oracle', link: '/portswigger-labs/sqli/sqli6' },
        { title: 'SQL injection UNION attack, determining the number of columns returned by the query', link: '/portswigger-labs/sqli/sqli7' },
        { title: 'SQL injection UNION attack, finding a column containing text', link: '/portswigger-labs/sqli/sqli8' },
        { title: 'SQL injection UNION attack, retrieving data from other tables', link: '/portswigger-labs/sqli/sqli9' },
        { title: 'SQL injection UNION attack, retrieving multiple values in a single column', link: '/portswigger-labs/sqli/sqli10' },
        { title: 'Blind SQL injection with conditional responses', link: '/portswigger-labs/sqli/sqli11' },
        { title: 'Blind SQL injection with conditional errors', link: '/portswigger-labs/sqli/sqli12' },
        { title: 'Visible error-based SQL injection', link: '/portswigger-labs/sqli/sqli13' },
        { title: 'Blind SQL injection with time delays', link: '/portswigger-labs/sqli/sqli14' },
        { title: 'Blind SQL injection with time delays and information retrieval', link: '/portswigger-labs/sqli/sqli15' },
        { title: 'Blind SQL injection with out-of-band interaction', link: '/portswigger-labs/sqli/sqli16' },
        { title: 'Blind SQL injection with out-of-band data exfiltration', link: '/portswigger-labs/sqli/sqli17' },
        { title: 'SQL injection with filter bypass via XML encoding', link: '/portswigger-labs/sqli/sqli18' }
      ]
    },
    {
      title: 'Cross-site scripting (XSS)',
      children: [
        { title: 'Reflected XSS into HTML context with nothing encoded', link: '/portswigger-labs/xss/xss1' },
        { title: 'Stored XSS into HTML context with nothing encoded', link: '/portswigger-labs/xss/xss2' },
        { title: 'DOM XSS in document.write sink using source location.search', link: '/portswigger-labs/xss/xss3' },
        { title: 'DOM XSS in innerHTML sink using source location.search', link: '/portswigger-labs/xss/xss4' },
        { title: 'DOM XSS in jQuery anchor href attribute sink using location.search source', link: '/portswigger-labs/xss/xss5' },
        { title: 'DOM XSS in jQuery selector sink using a hashchange event', link: '/portswigger-labs/xss/xss6' },
        { title: 'Reflected XSS into attribute with angle brackets HTML-encoded', link: '/portswigger-labs/xss/xss7' },
        { title: 'Stored XSS into anchor href attribute with double quotes HTML-encoded', link: '/portswigger-labs/xss/xss8' },
        { title: 'Reflected XSS into a JavaScript string with angle brackets HTML encoded', link: '/portswigger-labs/xss/xss9' },
        { title: 'DOM XSS in document.write sink using source location.search inside a select element', link: '/portswigger-labs/xss/xss10' },
        { title: 'DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded', link: '/portswigger-labs/xss/xss11' },
        { title: 'Reflected DOM XSS', link: '/portswigger-labs/xss/xss12' },
        { title: 'Stored DOM XSS', link: '/portswigger-labs/xss/xss13' }
      ]
    }
  ]
}
