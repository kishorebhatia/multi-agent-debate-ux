import React from 'react'
import { Group, Button } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <Group position="apart">
      <Button component={Link} to="/" variant="subtle">
        AI Debate Platform
      </Button>
      <Group>
        <Button component={Link} to="/debate" variant="light">
          Start Debate
        </Button>
        <Button component={Link} to="/login">
          Login
        </Button>
      </Group>
    </Group>
  )
}
