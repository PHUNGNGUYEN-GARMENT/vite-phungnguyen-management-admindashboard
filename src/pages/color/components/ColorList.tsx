import { App as AntApp, Button, Flex, Form, Input, List, Switch } from 'antd'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Color } from '~/typing'
import useColor from '../hooks/useColor'
import useColorList from '../hooks/useColorList'
import ColorListItem from './ColorListItem'
import { ColorTableDataType } from './ColorTable'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const { Search } = Input

const ColorList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setLoading,
    // openModal,'
    setOpenModal,
    searchText,
    setSearchText,
    dateCreation,
    setDateCreation,
    // handleAddNew,
    getColorList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useColor()
  const {
    form,
    setEditingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartDelete,
    handleStartSaveEditing
  } = useColorList()
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    getColorList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: Color) => {
            return {
              ...item,
              key: item.id
            } as ColorTableDataType
          })
        )
      }
    })
  }, [])

  return (
    <>
      <Flex vertical gap={20}>
        <Form.Item name='search'>
          <Search
            placeholder='Search code...'
            size='middle'
            enterButton
            allowClear
            onSearch={(value) => {
              if (value.length > 0) {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  search: {
                    field: 'productCode',
                    term: value
                  }
                }
                getColorList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Color) => {
                        return {
                          ...item,
                          key: item.id
                        } as ColorTableDataType
                      })
                    )
                  }
                })
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Form.Item>
        <Flex justify='space-between' align='center'>
          <Flex gap={10} align='center'>
            <Switch
              checkedChildren='Admin'
              unCheckedChildren='Admin'
              defaultChecked={false}
              checked={user.isAdmin}
              onChange={(val) => {
                dispatch(setAdminAction(val))
              }}
            />
            <Switch
              checkedChildren='Date Creation'
              unCheckedChildren='Date Creation'
              defaultChecked={dateCreation}
              onChange={(val) => {
                setDateCreation(val)
              }}
            />
            <Switch
              checkedChildren='Sorted'
              unCheckedChildren='Sorted'
              defaultChecked={false}
              onChange={(val) => {
                handleSorted(val ? 'asc' : 'desc', (meta) => {
                  if (meta.success) {
                    setDataSource(
                      meta.data.map((item: Color) => {
                        return {
                          ...item,
                          key: item.id
                        } as ColorTableDataType
                      })
                    )
                  }
                })
              }}
            />
          </Flex>
          <Flex gap={10} align='center'>
            <Button
              onClick={() => {
                form.setFieldValue('search', '')
                setSearchText('')
                getColorList(defaultRequestBody, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Color) => {
                        return {
                          ...item,
                          key: item.id
                        } as ColorTableDataType
                      })
                    )
                    message.success('Reloaded!')
                  }
                })
              }}
              className='flex items-center'
              type='default'
            >
              Reset
            </Button>

            {user.isAdmin && (
              <Button
                onClick={() => {
                  setOpenModal(true)
                }}
                className='flex items-center'
                type='primary'
                icon={<Plus size={20} />}
              >
                New
              </Button>
            )}
          </Flex>
        </Flex>

        <List
          className={props.className}
          itemLayout='vertical'
          size='large'
          pagination={{
            onChange: (page) => {
              const body: RequestBodyType = {
                ...defaultRequestBody,
                paginator: {
                  page: page,
                  pageSize: 5
                },
                search: {
                  field: 'nameColor',
                  term: searchText
                }
              }
              getColorList(body, (meta) => {
                if (meta?.success) {
                  setDataSource(
                    meta.data.map((item: Color) => {
                      return {
                        ...item,
                        key: item.id
                      } as ColorTableDataType
                    })
                  )
                }
              })
            },
            current: metaData?.page,
            pageSize: 5,
            total: metaData?.total
          }}
          loading={loading}
          dataSource={dataSource}
          renderItem={(item) => (
            <ColorListItem
              item={item}
              editing={isEditing(item.id!)}
              isAdmin={user.isAdmin}
              dateCreation={false}
              editingKey={''}
              deleteKey={''}
              setEditingKey={setEditingKey}
              setDeleteKey={setDeleteKey}
              setLoading={setLoading}
              handleStartSaveEditing={handleStartSaveEditing}
              handleUpdateItem={handleUpdateItem}
              handleStartDelete={handleStartDelete}
              handleDeleteItem={handleDeleteItem}
            />
          )}
        />
      </Flex>
    </>
  )
}

export default ColorList
