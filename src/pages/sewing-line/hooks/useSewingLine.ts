/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { SewingLine } from '~/typing'
import { SewingLineTableDataType } from '../SewingLinePage'

export default function useSewingLine(table: UseTableProps<SewingLineTableDataType>) {
  const { setLoading, page, setPage, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  // List
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])

  // New
  const [SewingLineNew, setSewingLineNew] = useState<SewingLine | undefined>(undefined)

  const loadData = async () => {
    await sewingLineService.getListItems(
      { ...defaultRequestBody, paginator: { page: page, pageSize: defaultRequestBody.paginator?.pageSize } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setSewingLines(meta.data as SewingLine[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [SewingLineNew])

  useEffect(() => {
    selfConvertDataSource(sewingLines)
  }, [sewingLines])

  const selfConvertDataSource = (_sewingLines: SewingLine[]) => {
    const items = _sewingLines ? _sewingLines : sewingLines
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as SewingLineTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SewingLineTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (newRecord.name && newRecord.name !== record.name) {
          console.log('SewingLine progressing...')
          await sewingLineService.updateItemByPk(record.id!, { name: newRecord.name }, setLoading, (meta) => {
            if (!meta?.success) {
              throw new Error('API update SewingLine failed')
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
      await sewingLineService.createNewItem(
        {
          name: formAddNew.name
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setSewingLineNew(meta.data as SewingLine)
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
    record: TableItemWithKey<SewingLineTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    await sewingLineService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
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
    sewingLineService.setPage(_page)
    setPage(_page)
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
    await sewingLineService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as SewingLine[])
      }
    })
  }

  const handleResetClick = async () => {
    setSearchText('')
    await sewingLineService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as SewingLine[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await sewingLineService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as SewingLine[])
        }
      },
      { field: 'name', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await sewingLineService.getListItems(
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
            selfConvertDataSource(meta?.data as SewingLine[])
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
    sewingLineService,
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
