import React from 'react';
import { FlatList } from 'react-native';
import { categories } from '../../utils/categories';
import { Container, Header, Title, Category, Icon, Name } from './styles';

interface Category {
    key: string;
    name: string;
}

interface CategorySelectProps {
    category: string;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
}

export function CategorySelect({ category, closeSelectCategory, setCategory }: CategorySelectProps) {
    return (
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>

            <FlatList data={categories} keyExtractor={(item) => item.key}
                style={{ flex: 1, width: '100%' }}
                renderItem={({ item }) => (
                    <Category>
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )}
            />

        </Container>
    )
}