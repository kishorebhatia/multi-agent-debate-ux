import React from 'react'
import { 
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack
} from '@mantine/core'

export default function Login() {
  return (
    <Paper radius="md" p="xl" withBorder mx="auto" mt={50} sx={{ maxWidth: 400 }}>
      <Title order={2} align="center" mb="md">
        Welcome Back
      </Title>
      
      <form>
        <Stack>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
          />
          
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
          />

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>

          <Text color="dimmed" size="sm" align="center">
            Don&apos;t have an account? Sign up
          </Text>
        </Stack>
      </form>
    </Paper>
  )
}
