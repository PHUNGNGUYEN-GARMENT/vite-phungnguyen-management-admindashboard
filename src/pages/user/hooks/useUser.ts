/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import RoleAPI from '~/api/services/RoleAPI'
import UserAPI from '~/api/services/UserAPI'
import UserRoleAPI from '~/api/services/UserRoleAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Role, User, UserRole } from '~/typing'
import { textComparator } from '~/utils/helpers'
import { UserNewRecordProps, UserTableDataType } from '../type'

export default function useUser(table: UseTableProps<UserTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  // Services
  const userService = useAPIService<User>(UserAPI)
  const roleService = useAPIService<Role>(RoleAPI)
  const userRoleService = useAPIService<UserRole>(UserRoleAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<UserNewRecordProps>({})

  // List
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  const loadData = async () => {
    await userService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: userService.page, pageSize: defaultRequestBody.paginator?.pageSize }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setUsers(meta.data as User[])
        }
      }
    )
    await userRoleService.getListItems(
      { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setUserRoles(meta.data as UserRole[])
        }
      }
    )
    await roleService.getListItems(
      { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setRoles(meta.data as Role[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(users, userRoles)
  }, [users, userRoles])

  const selfConvertDataSource = (_users: User[], _userRoles?: UserRole[]) => {
    const items = _users ? _users : users
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          userRoles: (_userRoles ? _userRoles : userRoles).filter((userRole) => userRole.userID === item.id)
        } as UserTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<UserTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (
          !record.username ||
          textComparator(newRecord.username, record.username) ||
          !record.password ||
          textComparator(newRecord.password, record.password) ||
          !record.fullName ||
          textComparator(newRecord.fullName, record.fullName) ||
          !record.phone ||
          textComparator(newRecord.phone, record.phone) ||
          !record.workDescription ||
          textComparator(newRecord.workDescription, record.workDescription) ||
          !record.avatar ||
          textComparator(newRecord.avatar, record.avatar) ||
          !record.birthday ||
          textComparator(newRecord.birthday, record.birthday)
        ) {
          console.log('User progressing...')
          await userService.updateItemByPk(record.id!, { ...newRecord }, setLoading, (meta) => {
            if (!meta?.success) {
              throw new Error('API update group failed')
            }
          })
        }
        await userRoleService.updateItemsBy?.(
          { field: 'userID', key: record.id! },
          newRecord.userRoles!.map((item) => {
            return {
              ...item
            }
          }),
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update UserRole failed')
            }
          }
        )
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
      const userNew: User = { ...formAddNew }
      const roles: Role[] = (formAddNew.roles as number[]).map((roleID) => {
        return roles.find((role) => role.id === roleID) as Role
      })
      console.log(formAddNew)
      setLoading(true)
      await userService.register(
        {
          ...userNew,
          isAdmin: roles.some((role) => role.role === 'admin')
        },
        setLoading,
        async (meta, msg) => {
          const newUser = meta?.data as User
          if (!meta?.success) {
            throw new Error(msg)
          }
          await userRoleService.updateItemsBy?.(
            { field: 'userID', key: newUser.id! },
            roles.map((roleID) => {
              return {
                userID: newUser.id,
                roleID: roleID
              } as UserRole
            }),
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update UserRole failed')
              }
            }
          )
          message.success(msg)
        }
      )
    } catch (error) {
      console.error(error)
      message.error(`${error}`)
    } finally {
      setLoading(false)
      setOpenModal(false)
      loadData()
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<UserTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    console.log(record)
    await userService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
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
    await userService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as User[])
        }
      },
      { field: 'fullName', term: searchText }
    )
  }

  const handleResetClick = async () => {
    setSearchText('')
    await userService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as User[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await userService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as User[])
        }
      },
      { field: 'fullName', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await userService.getListItems(
        {
          ...defaultRequestBody,
          search: {
            field: 'fullName',
            term: value
          }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as User[])
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
    userService,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    userRoles,
    roles
  }
}
