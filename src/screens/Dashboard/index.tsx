import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
    Container, Header, UserWrapper, UserInfo, Photo, User,
    UserGreeting, UserName, Icon, HighlightCards, Transactions, Title,
    TransactionList
} from './styles';

export interface DataListTransactionsProps extends TransactionCardProps{
    id: string;
}

export function Dashboard() {

    const data: DataListTransactionsProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount: 'R$ 12.000,00',
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: '03/07/2020',
        },
        {
            id: '2',
            type: 'negative',
            title: "Hamburgueria Pizza",
            amount: 'R$ 59,00',
            category: {
                name: 'Alimentação',
                icon: 'coffee'
            },
            date: '10/04/2020',
        },
        {
            id: '3',
            type: 'negative',
            title: "Aluguel do apartamento",
            amount: 'R$ 1.200,00',
            category: {
                name: 'Casa',
                icon: 'shopping-bag'
            },
            date: '10/04/2020',
        },
    ]


    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: "https://avatars.githubusercontent.com/u/28605252?v=4" }} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Anderson</UserName>
                        </User>
                    </UserInfo>

                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard type='up' title="Entrada" amount='17.400,00' lastTransaction='Ultima entrada dia 13 de Abril' />
                <HighlightCard type='down' title="Saida" amount='1.259,00' lastTransaction='Ultima saida dia 03 de Abril' />
                <HighlightCard type='total' title="Total" amount='16.141,00' lastTransaction='01 a 16 de Abril' />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={ (item : DataListTransactionsProps) => item.id }
                renderItem={({ item }) => <TransactionCard data={item} />}
                >
            </TransactionList>

        </Transactions>

        </Container >
    )
}