/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { ProductTableDataType } from '~/pages/product/type'
import { Importation } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ImportationTableDataType } from '../components/ImportationTable'

export default function useImportation(productRecord: ProductTableDataType) {
  const importationService = useAPIService<Importation>(ImportationAPI)

  const { message } = AntApp.useApp()

  const {
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    setDataSource,
    setDeleteKey,
    dateCreation,
    setDateCreation,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ImportationTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [importations, setImportations] = useState<Importation[]>([])
  const [importationNew, setImportationNew] = useState<Importation | undefined>(undefined)

  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  const amountQuantity = dataSource.reduce((acc, current) => acc + (current.quantity ?? 0), 0)

  const loadData = async () => {
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
    selfConvertDataSource(importations)
  }, [importations])

  const selfConvertDataSource = (_importations?: Importation[]) => {
    const items = _importations ? _importations : importations
    const convertDataSource = items.map((item) => {
      return {
        ...item,
        key: item.id
      } as ImportationTableDataType
    })
    setDataSource(convertDataSource.filter((item) => item.productID === productRecord.id))
  }

  const handleSaveClick = async (
    record: TableItemWithKey<ImportationTableDataType>,
    newRecord: TableItemWithKey<ImportationTableDataType>
  ) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (
          (newRecord.quantity && newRecord.quantity !== record.quantity) ||
          (newRecord.dateImported && DayJS(newRecord.dateImported).diff(DayJS(record.dateImported)))
        ) {
          console.log('Importation progressing...')
          await importationService.createOrUpdateItemByPk(
            record.id!,
            {
              quantity: newRecord.quantity,
              dateImported: newRecord.dateImported && DayJS(newRecord.dateImported).format(DatePattern.iso8601)
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await importationService.createNewItem(
        {
          productID: formAddNew.productID,
          quantity: formAddNew.quantity,
          dateImported: DayJS(formAddNew.dateImported).format(DatePattern.iso8601)
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            message.success(msg)
          } else {
            console.log('Errr')
            message.error(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
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
    await importationService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleConfirmDeleting(record.key!)
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
      onDataSuccess?.(meta)
    })
  }

  const handlePageChange = async (_page: number) => {
    importationService.setPage(_page)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      paginator: {
        page: _page,
        pageSize: 5
      },
      search: {
        field: 'productCode',
        term: searchText
      }
    }
    await importationService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Importation[])
      }
    })
  }

  return {
    loading,
    openModal,
    loadData,
    isEditing,
    editingKey,
    dataSource,
    setLoading,
    setOpenModal,
    setDeleteKey,
    dateCreation,
    setDataSource,
    setDateCreation,
    handleSaveClick,
    newRecord,
    amountQuantity,
    searchText,
    setSearchText,
    setNewRecord,
    handlePageChange,
    handleAddNewItem,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    importationService,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  }
}
