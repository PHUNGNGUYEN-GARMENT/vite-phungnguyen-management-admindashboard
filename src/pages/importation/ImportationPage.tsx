/* eslint-disable @typescript-eslint/no-explicit-any */
import useDevice from '~/components/hooks/useDevice'
import { Importation, Product, ProductColor, ProductGroup } from '~/typing'
import ImportationList from './components/ImportationList'
import ImportationTable from './components/ImportationTable'

export interface ImportationTableDataType extends Product {
  key?: React.Key
  importations: Importation[]
  productColor: ProductColor
  productGroup: ProductGroup
}

function ImportationPage() {
  const { width } = useDevice()

  return (
    <>
      {width >= 768 && <ImportationTable />}
      {width <= 768 && <ImportationList />}
    </>
  )
}

export default ImportationPage
