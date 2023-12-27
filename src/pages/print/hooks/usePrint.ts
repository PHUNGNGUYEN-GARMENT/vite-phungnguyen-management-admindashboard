/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import PrintAPI from '~/api/services/PrintAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Print } from '~/typing'
import { PrintTableDataType } from '../PrintPage'

export default function usePrint(table: UseTableProps<PrintTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const printService = useAPIService<Print>(PrintAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [prints, setPrints] = useState<Print[]>([])

  // New
  const [groupNew, setGroupNew] = useState<Print | undefined>(undefined)

  const loadData = async () => {
    await printService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setPrints(meta.data as Print[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [groupNew])

  useEffect(() => {
    selfConvertDataSource(prints)
  }, [prints])

  const selfConvertDataSource = (_prints: Print[]) => {
    const items = _prints ? _prints : prints
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as PrintTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<PrintTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (newRecord.name && newRecord.name !== record.name) {
          console.log('Group progressing...')
          await printService.updateItemByPk(record.id!, { name: newRecord.name }, setLoading, (meta) => {
            if (!meta?.success) {
              throw new Error('API update group failed')
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await printService.createNewItem(
        {
          name: formAddNew.name
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setGroupNew(meta.data as Print)
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
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<PrintTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    await printService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleConfirmDeleting(record.id!)
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
      onDataSuccess?.(meta)
    })
  }

  const handlePageChange = async (_page: number) => {
    printService.setPage(_page)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      paginator: {
        page: _page,
        pageSize: 5
      },
      search: {
        field: 'name',
        term: searchText
      }
    }
    await printService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Print[])
      }
    })
  }

  const handleResetClick = async () => {
    setSearchText('')
    await printService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Print[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await printService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Print[])
        }
      },
      { field: 'name', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await printService.getListItems(
        {
          ...defaultRequestBody,
          search: {
            field: 'name',
            term: value
          }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Print[])
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
    printService,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch
  }
}
