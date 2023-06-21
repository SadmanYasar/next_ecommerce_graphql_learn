import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`Find ${product.name} at Space Jelly Gear`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <img width={product.image.width} height={product.image.height} src={product.image.url} alt="" />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{
              __html: product.description?.html
            }} />

            <p className={styles.productPrice}>
              ${product.price}
            </p>
            <p className={styles.productBuy}>
              <Button className="snipcart-add-item"
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-image={product.image.url}
                data-item-url={`/products/${product.slug}`}
                data-item-name={product.name}>
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: 'https://api-ap-south-1.hygraph.com/v2/cliy8vqme012a01uu5448hq7g/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          slug
        }
      }
    `
  })

  const paths = data.data.products.map(product => {
    return {
      params: {
        productSlug: product.slug
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { productSlug } = params;

  const client = new ApolloClient({
    uri: 'https://api-ap-south-1.hygraph.com/v2/cliy8vqme012a01uu5448hq7g/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query ProductPage($slug: String) {
        product(where: {slug: $slug}) {
          id
          name
          image
          price
          description {
            html
          }
          slug
        }
      }
    `,
    variables: {
      slug: productSlug
    }
  })

  return {
    props: {
      product: data.data.product
    },
  }
}