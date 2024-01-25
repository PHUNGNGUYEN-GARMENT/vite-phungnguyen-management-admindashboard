/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Role } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { RoleTableDataType } from '../type'

export default function useRole(table: UseTableProps<RoleTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const roleService = useAPIService<Role>(RoleAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<Role>({})

  // List
  const [roles, setRoles] = useState<Role[]>([])

  const loadData = async () => {
    await roleService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setRoles(meta.data as Role[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(roles)
  }, [roles])

  const selfConvertDataSource = (_roles: Role[]) => {
    const items = _roles ? _roles : roles
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id
        } as RoleTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<RoleTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (
        !record.role ||
        textComparator(newRecord.role, record.role) ||
        !record.shortName ||
        textComparator(newRecord.shortName, record.shortName) ||
        !record.desc ||
        textComparator(newRecord.desc, record.desc)
      ) {
        console.log('Role progressing...')
        await roleService.updateItemByPk(record.id!, { ...newRecord }, setLoading, (meta) => {
          if (!meta?.success) {
            throw new Error('API update failed')
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: Role) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await roleService.createNewItem(
        {
          ...formAddNew
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error(msg)
          }
          message.success(msg)
        }
      )
    } catch (error) {
      console.error(error)
      message.success(`${error}`)
    } finally {
      setLoading(false)
      setOpenModal(false)
      loadData()
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<RoleTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    try {
      setLoading(true)
      await roleService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
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
    } catch (error) {
      console.error(`${error}`)
      message.error(`${error}`)
    } finally {
      setLoading(false)
      loadData()
    }
  }

  const handlePageChange = async (_page: number) => {
    await roleService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Role[])
        }
      },
      { field: 'desc', term: searchText }
    )
  }

  const handleResetClick = async () => {
    setSearchText('')
    await roleService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Role[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await roleService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Role[])
        }
      },
      { field: 'desc', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await roleService.getListItems(
        {
          ...defaultRequestBody,
          search: {
            field: 'desc',
            term: value
          }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Role[])
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
    roleService,
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