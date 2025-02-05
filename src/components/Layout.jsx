import React from 'react'
import { AppShell, Header, Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Navigation />
        </Header>
      }
    >
      <Container size="lg">
        <Outlet />
      </Container>
    </AppShell>
  )
}
