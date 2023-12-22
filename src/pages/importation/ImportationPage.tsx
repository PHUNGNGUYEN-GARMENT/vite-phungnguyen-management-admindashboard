/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, Form } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import useDevice from '~/components/hooks/useDevice'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPIService from '~/hooks/useAPIService'
import { Importation, Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ImportationTable from './components/ImportationTable'

export interface ImportationTableDataType extends Product {
  key?: React.Key
  importation?: Importation
}

function ImportationPage() {
  const { width } = useDevice()
  const productService = useAPIService<Product>(ProductAPI)
  const importationService = useAPIService<Importation>(ImportationAPI)
  const {
    form,
    loading,
    setLoading,
    editingKey,
    setDeleteKey,
    dataSource,
    isEditing,
    setDataSource,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ImportationTableDataType>([])
  const [products, setProducts] = useState<Product[]>([])
  const [importations, setImportations] = useState<Importation[]>([])
  const [importationNew, setImportationNew] = useState<Importation | undefined>(undefined)

  const { message } = AntApp.useApp()

  const loadData = async () => {
    await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProducts(meta.data as Product[])
      }
    })
    await importationService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setImportations(meta.data as Importation[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [importationNew])

  useEffect(() => {
    selfConvertDataSource(products, importations)
  }, [products, importations])

  const selfConvertDataSource = (_products: Product[], _importations?: Importation[]) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          importation: (_importations ? _importations : importations).find((i) => i.productID === item.id)
        } as ImportationTableDataType
      })
    )
  }

  const selfHandleSaveClick = async (item: TableItemWithKey<ImportationTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log({ row: row, item: item })
    try {
      if (
        (row.quantity && row.quantity !== item.importation?.quantity) ||
        (row.dateImported && DayJS(row.dateImported).diff(DayJS(item.importation?.dateImported)))
      ) {
        console.log('Importation progressing...')
        await importationService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          {
            quantity: row.quantity,
            dateImported: row.dateImported && DayJS(row.dateImported).format(DatePattern.iso8601)
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const itemNew = meta.data as Importation
              setImportationNew(itemNew)
            } else {
              throw new Error('API update Importation failed')
            }
          }
        )
      }
      message.success('Success!')
    } catch (error) {
      console.error(error)
      message.error('Failed')
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
      loadData()
    }
  }

  const handleConfirmDelete = async (item: TableItemWithKey<ImportationTableDataType>) => {
    if (item.importation?.id) {
      await importationService.deleteItemByPk(item.importation!.id!, setLoading, (meta, msg) => {
        if (meta) {
          if (meta.success) {
            handleStartDeleting(item.id!, () => {})
            message.success(msg)
          }
        } else {
          message.error(msg)
        }
      })
    }
  }

  const handlePageChange = async (_page: number) => {
    productService.setPage(_page)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      paginator: {
        page: _page,
        pageSize: 5
      },
      search: {
        field: 'productCode',
        term: form.getFieldValue('search') ?? ''
      }
    }
    await productService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        setProducts(meta.data as Product[])
      }
    })
    await importationService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setImportations(meta.data as Importation[])
      }
    })
  }

  return (
    <>
      <Form form={form}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={async (value) => {
            if (value.length > 0) {
              await productService.getListItems(
                {
                  ...defaultRequestBody,
                  search: {
                    field: 'productCode',
                    term: value
                  }
                },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    selfConvertDataSource(meta?.data as Product[])
                  }
                }
              )
            }
          }}
          onSortChange={async (val) => {
            await productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onResetClick={async () => {
            form.setFieldValue('search', '')
            await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
        >
          {/* {width >= 768 && (
            <ImportationTable
              loading={loading}
              setLoading={setLoading}
              metaData={productService.metaData}
              dataSource={dataSource}
              dateCreation={dateCreation}
              editingKey={editingKey}
              isEditing={isEditing}
              onPageChange={handlePageChange}
              onConfirmDelete={handleConfirmDelete}
              setDeleteKey={setDeleteKey}
              onSaveClick={selfHandleSaveClick}
              onStartEditing={handleStartEditing}
              onConfirmCancelEditing={handleConfirmCancelEditing}
              onConfirmCancelDeleting={handleConfirmCancelDeleting}
            />
          )} */}
          {/* {width <= 768 && (
            <ProductList
              loading={loading}
              setLoading={setLoading}
              metaData={productService.metaData}
              dataSource={dataSource}
              dateCreation={dateCreation}
              editingKey={editingKey}
              isEditing={isEditing}
              onPageChange={handlePageChange}
              onConfirmDelete={handleConfirmDelete}
              setDeleteKey={setDeleteKey}
              onSaveClick={selfHandleSaveClick}
              onStartEditing={handleStartEditing}
              onConfirmCancelEditing={handleConfirmCancelEditing}
              onConfirmCancelDeleting={handleConfirmCancelDeleting}
            />
          )} */}
        </BaseLayout>
      </Form>
    </>
  )
}

export default ImportationPage
