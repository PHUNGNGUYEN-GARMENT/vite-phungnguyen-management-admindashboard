/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { ProductTableDataType } from '~/pages/product/type'
import { Color, Product } from '~/typing'
import { ColorTableDataType } from '../ColorPage'

export default function useColor() {
  const colorService = useAPIService<Color>(ColorAPI)

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
    handleStartEditing,
    handleStartDeleting,
    handleConfirmDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ColorTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  const [colors, setColors] = useState<Color[]>([])

  const [colorNew, setColorNew] = useState<Color | undefined>(undefined)

  const loadData = async () => {
    await colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setColors(meta.data as Product[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [colorNew])

  useEffect(() => {
    selfConvertDataSource(colors)
  }, [colors])

  const selfConvertDataSource = (_colors: Color[]) => {
    const items = _colors ? _colors : colors
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as ColorTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ColorTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (
          (newRecord.name && newRecord.name !== record.name) ||
          (newRecord.hexColor && newRecord.hexColor !== record.hexColor)
        ) {
          console.log('Color progressing...')
          await colorService.updateItemByPk(
            record.id!,
            { name: newRecord.name, hexColor: newRecord.hexColor },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update Color failed')
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
      await colorService.createNewItem(
        {
          name: formAddNew.name,
          hexColor: formAddNew.hexColor
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setColorNew(meta.data as Color)
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
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    await colorService.deleteItemByPk(item.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleConfirmDeleting(item.id!)
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
      onDataSuccess?.(meta)
    })
  }

  const handlePageChange = async (_page: number) => {
    colorService.setPage(_page)
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
    await colorService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Color[])
      }
    })
  }

  return {
    searchText,
    setSearchText,
    loading,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    isEditing,
    editingKey,
    dataSource,
    setLoading,
    setOpenModal,
    setDeleteKey,
    dateCreation,
    setDataSource,
    colorService,
    setDateCreation,
    handleSaveClick,
    handleAddNewItem,
    handlePageChange,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  }
}
