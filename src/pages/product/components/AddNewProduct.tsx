import {
  Calendar,
  Flex,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography
} from 'antd'
import React, { memo } from 'react'
import useFormProduct from '../hooks/useProductForm'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setLoading: (enable: boolean) => void
  setOpenModal: (status: boolean) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewProduct: React.FC<Props> = ({ ...props }) => {
  const {
    product,
    setProduct,
    options,
    prints,
    dateInputValue,
    dateOutputValue,
    onSelectDateInputNPL,
    onSelectDateOutputFCR,
    onPanelChangeDateInputNPL,
    onPanelChangeDateOutputFCR,
    handleChangeSelector,
    handleOk,
    handleCancel
  } = useFormProduct()
  console.log('Load AddNewProduct...')

  return (
    <Modal
      open={props.openModal}
      onOk={() => handleOk(props.setLoading)}
      centered
      width='auto'
      onCancel={() => {
        props.setOpenModal(false)
        handleCancel()
      }}
    >
      <Flex
        vertical
        gap={20}
        className='w-full sm:w-[500px] md:w-[600px] lg:w-[900px]'
      >
        <Typography.Title level={2}>Add new product</Typography.Title>
        <Flex vertical={false} gap={20} className='w-full'>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-24 flex-shrink-0'>
              Mã Code:
            </Typography.Text>
            <Input
              value={product.productCode}
              onChange={(e) =>
                setProduct({ ...product, productCode: e.target.value })
              }
              allowClear
              className='w-full'
              placeholder='Product code..'
            />
          </Flex>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-24 flex-shrink-0'>
              Số lượng PO:
            </Typography.Text>
            <InputNumber
              className='w-full'
              value={product.quantityPO}
              onChange={(value) => {
                console.log(value)
                if (value) {
                  setProduct({ ...product, quantityPO: value })
                }
              }}
              placeholder='Quantity po..'
            />
          </Flex>
        </Flex>
        <Flex align='center' gap={5} className='w-full'>
          <Typography.Text className='w-24 flex-shrink-0'>
            Nơi in - Thêu:
          </Typography.Text>
          <Select
            mode='multiple'
            allowClear
            placeholder='Please select'
            onChange={handleChangeSelector}
            optionLabelProp='label'
            options={options(
              prints.map((item) => {
                return { value: item.printID, label: item.name }
              })
            )}
            className='w-full'
            style={{
              width: '100%'
            }}
          />
        </Flex>
        <Flex
          vertical={false}
          gap={30}
          className='flex w-full flex-col items-center justify-center lg:flex-row'
        >
          <Flex vertical>
            <Typography.Text className='flex-shrink-0'>
              Ngày nhập NPL:
            </Typography.Text>
            <Calendar
              fullscreen={false}
              value={dateInputValue}
              onSelect={onSelectDateInputNPL}
              onPanelChange={onPanelChangeDateInputNPL}
            />
          </Flex>
          <Flex vertical>
            <Typography.Text className='flex-shrink-0'>
              Ngày xuất FCR:
            </Typography.Text>
            <Calendar
              fullscreen={false}
              value={dateOutputValue}
              onSelect={onSelectDateOutputFCR}
              onPanelChange={onPanelChangeDateOutputFCR}
            />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewProduct)
