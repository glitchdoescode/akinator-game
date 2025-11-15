import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Spinner,
  Badge,
  Flex,
  IconButton,
  createToaster,
  Card,
} from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'

const toaster = createToaster({
  placement: 'top',
  duration: 5000,
})

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [sessionId, setSessionId] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isGuess, setIsGuess] = useState(false)

  const startGame = async () => {
    setIsLoading(true)
    setGameStarted(true)
    setGameOver(false)
    setQuestionsAsked(0)

    try {
      const response = await fetch(`${API_URL}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error('Failed to start game')

      const data = await response.json()
      setSessionId(data.session_id)
      setCurrentQuestion(data.question)
      setQuestionsAsked(1)
      setIsGuess(data.is_guess)
    } catch (error) {
      toaster.error({
        title: 'Error starting game',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async (answer) => {
    if (isLoading || gameOver) return

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answer: answer,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit answer')

      const data = await response.json()
      setCurrentQuestion(data.question)
      setQuestionsAsked(prev => prev + 1)
      setIsGuess(data.is_guess)
      setGameOver(data.game_over)

      if (data.game_over) {
        toaster.success({
          title: '🎉 I guessed correctly!',
          description: 'Thanks for playing!',
        })
      }
    } catch (error) {
      toaster.error({
        title: 'Error submitting answer',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setCurrentQuestion('')
    setQuestionsAsked(0)
    setIsGuess(false)
    setSessionId('')
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" mb={2} bgGradient="to-r" gradientFrom="purple.500" gradientTo="pink.500" bgClip="text">
              🧞 Akinator
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="lg">
              Think of a character and I'll guess who it is!
            </Text>
          </Box>

          {!gameStarted ? (
            /* Start Screen */
            <Card.Root>
              <Card.Body p={12}>
                <VStack gap={6}>
                  <Text fontSize="xl" fontWeight="medium" textAlign="center">
                    Think of any character, person, animal, or thing...
                  </Text>
                  <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
                    I'll try to guess what you're thinking by asking questions!
                  </Text>
                  <Button
                    size="lg"
                    colorPalette="purple"
                    onClick={startGame}
                    loading={isLoading}
                    px={12}
                    py={6}
                    fontSize="xl"
                  >
                    {isLoading ? 'Starting...' : 'Start Game'}
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : (
            /* Game Screen */
            <Card.Root>
              {/* Stats Bar */}
              <Box px={6} py={4} borderBottomWidth="1px" bg="purple.50" _dark={{ bg: "purple.900/20" }}>
                <Flex justify="space-between" align="center">
                  <HStack gap={3}>
                    <Badge colorPalette="purple" size="lg">
                      Question {questionsAsked}
                    </Badge>
                    {isGuess && (
                      <Badge colorPalette="yellow" size="lg">
                        🎯 Final Guess
                      </Badge>
                    )}
                  </HStack>
                  <IconButton
                    aria-label="Reset game"
                    onClick={resetGame}
                    variant="ghost"
                    colorPalette="red"
                  >
                    <RepeatIcon />
                  </IconButton>
                </Flex>
              </Box>

              {/* Current Question Display */}
              <Box p={{ base: 6, md: 12 }} textAlign="center" minH={{ base: "200px", md: "300px" }} display="flex" alignItems="center" justifyContent="center">
                <VStack gap={6} width="100%">
                  {isLoading ? (
                    <>
                      <Spinner size="xl" colorPalette="purple" />
                      <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" _dark={{ color: "gray.400" }}>
                        Thinking...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Heading
                        size={{ base: "lg", md: "xl" }}
                        textAlign="center"
                        color="gray.900"
                        _dark={{ color: "white" }}
                        px={{ base: 2, md: 0 }}
                        wordBreak="break-word"
                      >
                        {currentQuestion}
                      </Heading>
                      {isGuess && (
                        <Text fontSize={{ base: "sm", md: "md" }} color="yellow.600" _dark={{ color: "yellow.400" }} fontWeight="medium">
                          Is this your character?
                        </Text>
                      )}
                    </>
                  )}
                </VStack>
              </Box>

              {/* Answer Buttons */}
              {!gameOver && !isLoading && (
                <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }} borderTopWidth="1px">
                  <VStack gap={4}>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
                      Choose your answer:
                    </Text>
                    <VStack gap={3} width="100%">
                      <HStack gap={3} justify="center" flexWrap="wrap" width="100%">
                        <Button
                          size={{ base: "md", md: "lg" }}
                          colorPalette="green"
                          onClick={() => submitAnswer('Yes')}
                          disabled={isLoading}
                          px={{ base: 6, md: 8 }}
                          flex={{ base: "1", md: "0" }}
                          minW={{ base: "140px", md: "auto" }}
                        >
                          ✓ Yes
                        </Button>
                        <Button
                          size={{ base: "md", md: "lg" }}
                          colorPalette="red"
                          onClick={() => submitAnswer('No')}
                          disabled={isLoading}
                          px={{ base: 6, md: 8 }}
                          flex={{ base: "1", md: "0" }}
                          minW={{ base: "140px", md: "auto" }}
                        >
                          ✗ No
                        </Button>
                      </HStack>
                      <HStack gap={3} justify="center" flexWrap="wrap" width="100%">
                        <Button
                          size={{ base: "md", md: "lg" }}
                          colorPalette="gray"
                          onClick={() => submitAnswer("Don't Know")}
                          disabled={isLoading}
                          px={{ base: 6, md: 8 }}
                          flex={{ base: "1", md: "0" }}
                          minW={{ base: "140px", md: "auto" }}
                        >
                          🤷 Don't Know
                        </Button>
                        <Button
                          size={{ base: "md", md: "lg" }}
                          colorPalette="yellow"
                          onClick={() => submitAnswer('Maybe')}
                          disabled={isLoading}
                          px={{ base: 6, md: 8 }}
                          flex={{ base: "1", md: "0" }}
                          minW={{ base: "140px", md: "auto" }}
                        >
                          🔄 Maybe
                        </Button>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              )}

              {/* Game Over */}
              {gameOver && (
                <Box px={6} py={8} bg="green.50" _dark={{ bg: "green.900/20" }} borderTopWidth="1px">
                  <VStack gap={4}>
                    <Text fontSize="3xl" fontWeight="bold">
                      🎉 I Win!
                    </Text>
                    <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
                      I guessed your character correctly!
                    </Text>
                    <Button
                      colorPalette="purple"
                      onClick={resetGame}
                      size="lg"
                      px={8}
                    >
                      Play Again
                    </Button>
                  </VStack>
                </Box>
              )}
            </Card.Root>
          )}

          {/* Footer */}
          <Text textAlign="center" color="gray.500" fontSize="sm">
            Powered by LangGraph
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default App
