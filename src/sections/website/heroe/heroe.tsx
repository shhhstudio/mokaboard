import React from 'react'
import { Badge, Flex, Icon, SimpleGrid, Stack, Button } from '@chakra-ui/react'
import { LuRocket } from 'react-icons/lu'
import { HeroHeader } from './heroe-header'
import { ImagePlaceholder } from './image-placeholder'

export const Heroe = () => (
    <SimpleGrid columns={{ base: 1, lg: 2 }}>
        <Flex
            align="center"
            justify="center"
            ps={{ base: '4', md: '6', lg: '16' }}
            pe={{ base: '4', md: '16' }}
            py={{ base: '16', md: '24' }}
        >
            <HeroHeader
                headline="Make What Matters Visible."
                description="MOKABOARD is your weekly board to clarify objectives, share structured updates, and track what counts for your team or your audience. No noise. Just focus, transparency, and progress."
                justifyContent="center"
            >
                <Stack direction={{ base: 'column', md: 'row' }} gap="3">
                    <Button size={{ base: 'lg', md: '2xl' }}>Start Your Board</Button>
                    <Button variant="outline" size={{ base: 'lg', md: '2xl' }} colorPalette="gray">
                        See How It Works
                    </Button>
                </Stack>
            </HeroHeader>
        </Flex>
        <ImagePlaceholder minH={{ base: '96', lg: "90vh" }} />
    </SimpleGrid>
)
