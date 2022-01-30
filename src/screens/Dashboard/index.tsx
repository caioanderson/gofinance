import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
    Container, Header, UserWrapper, UserInfo, Photo, User,
    UserGreeting, UserName, LogoutButton, Icon, HighlightCards, Transactions, Title,
    TransactionList, LoadingContainer
} from './styles';
import { useTheme } from 'styled-components';

export interface DataListTransactionsProps extends TransactionCardProps {
    id: string;
}

interface HighlightData {
    amount: string;
    lastTransaction: string;
}

interface HighlightDataProps {
    entries: HighlightData;
    expensive: HighlightData;
    total: HighlightData;
}

export function Dashboard() {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState<DataListTransactionsProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightDataProps>({} as HighlightDataProps);
    console.log("🚀 ~ file: index.tsx ~ line 31 ~ Dashboard ~ highlightData", highlightData)


    const dataKey = '@gofinance:transactions';

    function getLastTransactionDate(collection: DataListTransactionsProps[], type: 'positive' | 'negative') {

        const lastTransactions = new Date(Math.max.apply(Math, collection
            .filter((transaction) => transaction.type === type)
            .map((transaction) => new Date(transaction.date).getTime())));

        return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', { month: 'long' })}`;
       }

    async function loadTransaction() {
        const response = await AsyncStorageLib.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;


        const transactionsFormatted: DataListTransactionsProps[] = transactions
            .map((item: DataListTransactionsProps) => {

                if (item.type === "positive") {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amountFormatted = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const dateFormatted = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    amount: amountFormatted,
                    category: item.category,
                    date: dateFormatted,
                }

            });


        setData(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${lastTransactionExpensives}`;

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            },

        });

        setIsLoading(false);


    }

    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadingContainer>
                        <ActivityIndicator color={theme.colors.primary} size="large" />
                    </LoadingContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: "https://avatars.githubusercontent.com/u/28605252?v=4" }} />
                                    <User>
                                        <UserGreeting>Olá, </UserGreeting>
                                        <UserName>Anderson</UserName>
                                    </User>
                                </UserInfo>

                                <LogoutButton onPress={() => { }}>
                                    <Icon name="power" />
                                </LogoutButton>


                            </UserWrapper>
                        </Header>

                        <HighlightCards>
                            <HighlightCard type='up' title="Entrada" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransaction} />
                            <HighlightCard type='down' title="Saida" amount={highlightData.expensive.amount} lastTransaction={highlightData.expensive.lastTransaction} />
                            <HighlightCard type='total' title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction} />
                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>

                            <TransactionList
                                data={data}
                                keyExtractor={(item: DataListTransactionsProps) => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            >
                            </TransactionList>

                        </Transactions>
                    </>}
        </Container >
    )
}