/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import GarmentNoteStatusAPI from '~/api/services/GarmentNoteStatusAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { GarmentNoteStatus } from '~/typing'
import { GarmentNoteStatusTableDataType } from '../type'

export default function useGarmentNoteStatus(table: UseTableProps<GarmentNoteStatusTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const accessoryNoteService = useAPIService<GarmentNoteStatus>(GarmentNoteStatusAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<GarmentNoteStatusTableDataType>({})

  // List
  const [accessoryNotes, setGarmentNoteStatuss] = useState<GarmentNoteStatus[]>([])

  // New
  const [accessoryNoteNew, setGarmentNoteStatusNew] = useState<GarmentNoteStatus | undefined>(undefined)

  const loadData = async () => {
    await accessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setGarmentNoteStatuss(meta.data as GarmentNoteStatus[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [accessoryNoteNew])

  useEffect(() => {
    selfConvertDataSource(accessoryNotes)
  }, [accessoryNotes])

  const selfConvertDataSource = (_accessoryNotes: GarmentNoteStatus[]) => {
    const items = _accessoryNotes ? _accessoryNotes : accessoryNotes
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as GarmentNoteStatusTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<GarmentNoteStatusTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (newRecord.title !== record.title) {
          console.log('GarmentNoteStatus progressing...')
          await accessoryNoteService.updateItemByPk(record.id!, { title: newRecord.title }, setLoading, (meta) => {
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
      await accessoryNoteService.createNewItem(
        {
          title: formAddNew.title
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setGarmentNoteStatusNew(meta.data as GarmentNoteStatus)
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
    record: TableItemWithKey<GarmentNoteStatusTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    await accessoryNoteService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
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
    accessoryNoteService.setPage(_page)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      paginator: {
        page: _page,
        pageSize: 5
      },
      search: {
        field: 'title',
        term: searchText
      }
    }
    await accessoryNoteService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as GarmentNoteStatus[])
      }
    })
  }

  const handleResetClick = async () => {
    setSearchText('')
    await accessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as GarmentNoteStatus[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await accessoryNoteService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as GarmentNoteStatus[])
        }
      },
      { field: 'title', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await accessoryNoteService.getListItems(
        {
          ...defaultRequestBody,
          search: {
            field: 'title',
            term: value
          }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as GarmentNoteStatus[])
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
    accessoryNoteService,
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
