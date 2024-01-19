/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Importation } from '~/typing'
import { dateComparator, numberComparator } from '~/utils/helpers'
import { ImportationTableDataType } from '../type'

export interface ImportationNewRecordProps {
  quantity?: number | null
  dateImported?: string | null
}

export default function useImportation(table: UseTableProps<ImportationTableDataType>) {
  const { dataSource, setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table
  const importationService = useAPIService<Importation>(ImportationAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [importations, setImportations] = useState<Importation[]>([])
  const [importationNew, setImportationNew] = useState<Importation | undefined>(undefined)

  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<ImportationNewRecordProps>({})

  const amountQuantity =
    dataSource && dataSource.length > 0 ? dataSource.reduce((acc, current) => acc + (current.quantity ?? 0), 0) : 0

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
  }, [importationNew])

  useEffect(() => {
    selfConvertDataSource(importations)
  }, [importations])

  const selfConvertDataSource = (_importations?: Importation[]) => {
    const items = _importations ? _importations : importations
    if (items.length > 0) {
      setDataSource(
        items.map((item) => {
          return {
            ...item,
            key: item.id
          } as ImportationTableDataType
        })
      )
    }
  }

  const handleSaveClick = async (
    record: TableItemWithKey<ImportationTableDataType>,
    newRecord: TableItemWithKey<ImportationTableDataType>
  ) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (
        newRecord &&
        (numberComparator(newRecord.quantity, record.quantity) ||
          dateComparator(newRecord.dateImported, record.dateImported))
      ) {
        console.log('Importation progressing...')
        await importationService.createOrUpdateItemByPk(
          record.id!,
          {
            quantity: newRecord.quantity,
            dateImported: newRecord.dateImported
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
      message.error('Failed')
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
      loadData()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: any) => {
    try {
      setLoading(true)
      await importationService.createNewItem(
        {
          productID: formAddNew.productID,
          quantity: formAddNew.quantity,
          dateImported: formAddNew.dateImported
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            message.success(msg)
          } else {
            message.error(msg)
          }
        }
      )
    } catch (error) {
      message.error('Failed')
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
    await importationService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Importation[])
        }
      },
      {
        field: 'productCode',
        term: searchText
      }
    )
  }

  return {
    openModal,
    loadData,
    dataSource,
    setLoading,
    setOpenModal,
    setDataSource,
    handleSaveClick,
    newRecord,
    amountQuantity,
    searchText,
    setSearchText,
    setNewRecord,
    handlePageChange,
    handleAddNewItem,
    importationService,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
