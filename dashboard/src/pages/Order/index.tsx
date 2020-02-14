import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table, Tag } from 'antd'

import { useStoreActions, useStoreState } from '../../store'
import { orderRepository } from '../../services/repositories'
import Loading from '../../components/Loading'
import { PATH_ORDER, PATH_PRODUCT } from '../../constants'

const OrderIndex = () => {
  const [isLoading, setLoading] = useState(false)

  const shops = useStoreState(s => s.shopState.shops)
  const shopId = useStoreState(s => s.activeState.shopId)
  const activeShop = shops.find(s => s.id === shopId)

  const orders = useStoreState(s => s.orderState.orders)
  const setOrders = useStoreActions(s => s.orderState.setOrders)

  useEffect(() => {
    if (!activeShop || orders.length > 0) return
    ;(async () => {
      setLoading(true)
      setOrders(await orderRepository.findByShop(activeShop.id))
      setLoading(false)
    })()
  }, [activeShop, orders, setOrders])

  function renderStatusTag(status: string) {
    const color =
      status === 'unpaid'
        ? 'red'
        : status === 'approving'
        ? 'orange'
        : status === 'paid'
        ? 'green'
        : status === 'rejected'
        ? 'geekblue'
        : status === 'canceled'
        ? 'purple'
        : ''
    return <Tag color={color}>{status.toUpperCase()}</Tag>
  }

  const columns = [
    {
      title: 'Order',
      dataIndex: 'id',
    },
    {
      title: 'Product',
      dataIndex: 'productId',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ]

  const dataSource = orders.map(order => {
    const id = order.createdAt.replace(/[-T:Z.]/g, '')
    return {
      key: order.id,
      id: <Link to={`${PATH_ORDER}/${order.id}`}>{id}</Link>,
      productId: <Link to={`${PATH_PRODUCT}/${order.productId}`}>{order.productId}</Link>,
      createdAt: new Date(order.createdAt).toLocaleString('th', { timeZone: 'Asia/Bangkok' }),
      amount: 123,
      status: renderStatusTag(order.status),
    }
  })

  return (
    <div>
      <Card title="Orders" bordered={false}>
        {isLoading ? (
          <Loading position="center" />
        ) : (
          <Table columns={columns} dataSource={dataSource} />
        )}
      </Card>
    </div>
  )
}

export default OrderIndex
