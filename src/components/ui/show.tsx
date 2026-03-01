import React from 'react'

const Show = ({ children, if: condition, fallback = '' }: { children: React.ReactNode, if: boolean | any, fallback?: React.ReactNode }) => {
    return !!condition ? children : fallback
}

export default Show