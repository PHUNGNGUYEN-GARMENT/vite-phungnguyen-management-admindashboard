import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Importation, Product } from '~/typing'
import { ImportationTableDataType } from '../type'

export default function useImportationTable(table: UseTableProps<ImportationTableDataType>) {
  const { dataSource, setDataSource, setLoading, handleConfirmCancelEditing } = table

  // Services
  const importationService = useAPIService<Importation>(ImportationAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<Importation>({})

  // List
  const [importations, setImportations] = useState<Importation[]>([])

  const amountQuantity =
    dataSource && dataSource.length > 0 ? dataSource.reduce((acc, current) => acc + (current.quantity ?? 0), 0) : 0

  // New
  const loadData = async () => {
    await importationService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: importationService.page, pageSize: defaultRequestBody.paginator?.pageSize }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setImportations(meta.data as Importation[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(importations)
  }, [importations])

  const selfConvertDataSource = (_importations: Importation[]) => {
    const items = _importations ? _importations : importations
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as ImportationTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ImportationTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (newRecord) {
        console.log('Importation progressing: ', newRecord)
        await importationService.updateItemByPk(
          record.id!,
          {
            ...newRecord
          },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update failed')
            }
          }
        )
      } else {
        console.log('add new')
        await importationService.createNewItem(newRecord, table.setLoading, (meta) => {
          if (!meta?.success) {
            throw new Error('API create failed')
          }
        })
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

  const handleAddNewItem = async (formAddNew: { productID: number; importation: Importation }) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await importationService.createNewItem(
        {
          productID: formAddNew.productID,
          ...formAddNew.importation
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API create failed')
          } else {
            message.success(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
      message.error('Failed!')
    } finally {
      setLoading(false)
      setOpenModal(false)
      loadData()
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<ImportationTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await importationService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
        if (!meta?.success) {
          throw new Error('API delete failed')
        }
        message.success(msg)
        onDataSuccess?.(meta)
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadData()
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    await importationService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Product[])
        }
      },
      { field: 'productCode', term: searchText }
    )
  }

  const handleResetClick = async () => {
    setSearchText('')
    loadData()
  }

  const handleSortChange = async (checked: boolean) => {
    await importationService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Product[])
        }
      },
      { field: 'productCode', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await importationService.getListItems(
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
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    importationService,
    amountQuantity
  }
}
