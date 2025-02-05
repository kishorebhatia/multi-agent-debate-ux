import React from 'react'
import { Title, Text, Button, Stack, Group } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Stack spacing="xl" align="center" py={50}>
      <Title order={1}>Welcome to AI Debate Platform</Title>
      <Text size="lg" align="center">
        Engage AI agents in strategic debates and gain diverse perspectives
      </Text>
      <Group>
        <Button component={Link} to="/debate" size="lg">
          Start a Debate
        </Button>
        <Button component={Link} to="/login" variant="light" size="lg">
          Sign Up
        </Button>
      </Group>
    </Stack>
  )
}
