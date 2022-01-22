import React from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { categories } from '../../utils/categories';
import {
    Container, Header, Title, Category, Icon, Name, Separator,
    Footer
} from './styles';

interface Category {
    key: string;
    name: string;
}

interface CategorySelectProps {
    category: Category;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
}


export function CategorySelect({ category, closeSelectCategory, setCategory }: CategorySelectProps) {

    function handlerCategorySelect(item : Category){
        setCategory(item);
    }

    return (
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>

            <FlatList data={categories} keyExtractor={(item) => item.key}
                style={{ flex: 1, width: '100%' }}
                renderItem={({ item }) => (
                    <Category
                        onPress={() => handlerCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />

            <Footer>
                <Button title="Selecionar"
                    onPress={closeSelectCategory}
                />
            </Footer>
        </Container>
    )
}