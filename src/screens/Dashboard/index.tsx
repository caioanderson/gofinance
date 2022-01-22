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

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },

        });

        setIsLoading(!isLoading);


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
                            <HighlightCard type='up' title="Entrada" amount={highlightData.entries.amount} lastTransaction='Ultima entrada dia 13 de Abril' />
                            <HighlightCard type='down' title="Saida" amount={highlightData.expensive.amount} lastTransaction='Ultima saida dia 03 de Abril' />
                            <HighlightCard type='total' title="Total" amount={highlightData.total.amount} lastTransaction='01 a 16 de Abril' />
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