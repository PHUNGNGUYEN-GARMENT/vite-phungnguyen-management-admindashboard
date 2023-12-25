/* eslint-disable @typescript-eslint/no-explicit-any */
import useDevice from '~/components/hooks/useDevice'
import { Importation, ProductColor, ProductGroup } from '~/typing'
import ImportationList from './components/ImportationList'
import ImportationTable from './components/ImportationTable'

export interface ImportationTableDataType extends Importation {
  key?: React.Key
  productColors: ProductColor[]
  productGroups: ProductGroup[]
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
