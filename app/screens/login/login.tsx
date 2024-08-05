import { Button, Text, View } from "react-native"

const LoginScreen = () => {
  const handleLogin = () => {
    return null
  }

  return (
    <View> 
      <Text>This is login page text placeholder</Text>
      <Button title="login" onPress={handleLogin}></Button>
    </View>
  )
}

export default LoginScreen