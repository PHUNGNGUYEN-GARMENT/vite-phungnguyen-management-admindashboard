interface ProductPageProps extends React.HTMLAttributes<HTMLElement> {}

// eslint-disable-next-line no-empty-pattern
function ProductPage({}: ProductPageProps) {
  // useEffect(() => {
  //   ProductApi.listProduct().then((res) => {
  //     colorApi.colors().then((col) => {})
  //     if (res) {
  //       setProducts(res.data)
  //     }
  //   })
  // }, [])

  return (
    <div>
      {/* <Table columns={columns} dataSource={products.map((item, index) => {})} />
      {products.length} */}
    </div>
  )
}

export default ProductPage
