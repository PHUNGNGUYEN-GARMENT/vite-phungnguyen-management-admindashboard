import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { AccessoryNote } from '~/typing'
import { AccessoryNoteTableDataType } from '../type'

export default function useAccessoryNote(table: UseTableProps<AccessoryNoteTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<AccessoryNoteTableDataType>({})

  // List
  const [accessoryNotes, setAccessoryNotes] = useState<AccessoryNote[]>([])

  // New
  const [accessoryNoteNew, setAccessoryNoteNew] = useState<AccessoryNote | undefined>(undefined)

  const loadData = async () => {
    try {
      setLoading(true)
      await accessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          setAccessoryNotes(meta.data as AccessoryNote[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [accessoryNoteNew])

  useEffect(() => {
    selfConvertDataSource(accessoryNotes)
  }, [accessoryNotes])

  const selfConvertDataSource = (_accessoryNotes: AccessoryNote[]) => {
    const items = _accessoryNotes ? _accessoryNotes : accessoryNotes
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as AccessoryNoteTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<AccessoryNoteTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (newRecord.title !== record.title || newRecord.summary !== record.summary) {
          console.log('AccessoryNote progressing...')
          await accessoryNoteService.updateItemByPk(
            record.id!,
            { title: newRecord.title, summary: newRecord.summary },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update group failed')
              }
            }
          )
        }
        message.success('Success!')
      } catch (error: any) {
        const resError: ResponseDataType = error.data
        message.error(`${resError.message}`)
      } finally {
        setLoading(false)
        handleConfirmCancelEditing()
        loadData()
      }
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await accessoryNoteService.createNewItem(
        {
          title: formAddNew.title,
          summary: formAddNew.summary
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setAccessoryNoteNew(meta.data as AccessoryNote)
            message.success(msg)
          } else {
            console.log('Errr')
            message.error(msg)
          }
        }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<AccessoryNoteTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    try {
      setLoading(true)
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
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    try {
      setLoading(true)
      await accessoryNoteService.pageChange(
        _page,
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as AccessoryNote[])
          }
        },
        { field: 'name', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetClick = async () => {
    try {
      setLoading(true)
      setSearchText('')
      await accessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as AccessoryNote[])
        }
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = async (checked: boolean) => {
    try {
      setLoading(true)
      await accessoryNoteService.sortedListItems(
        checked ? 'asc' : 'desc',
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as AccessoryNote[])
          }
        },
        { field: 'name', term: searchText }
      )
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      if (value.length > 0) {
        await accessoryNoteService.getListItems(
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
              selfConvertDataSource(meta?.data as AccessoryNote[])
            }
          }
        )
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
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
