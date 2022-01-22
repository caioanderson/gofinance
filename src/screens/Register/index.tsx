import React, { useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { InputReactHookForm } from '../../components/InputReactHookForm';
import { CategorySelect } from '../CategorySelect';

import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor numérico').positive('O valor não pode ser negativo').required('Preço é obrigatório'),
})

interface FormData {
    name: string;
    amount: string;
}

export function Register() {

    const navigation = useNavigation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const [transactionType, setTransactionType] = useState('');
    const [categoryModal, setCategoryModal] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria',
    })

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModal(true)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModal(false)
    }

    async function handleRegister(form: FormData) {

        if (!transactionType) return Alert.alert('Selecione o tipo da transação');
        if (category.key === 'category') return Alert.alert('Selecione a categoria');

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category,
            date: new Date()
        }

        try {

            const dataKey = '@gofinance:transactions';

            const data = await AsyncStorageLib.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [...currentData, newTransaction]

            await AsyncStorageLib.setItem(dataKey, JSON.stringify(dataFormatted));
            
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'categoria',
            });

            navigation.navigate("Listagem");

        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possivel salvar")
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputReactHookForm
                            control={control}
                            name="name"
                            placeholder="Nome"
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputReactHookForm
                            control={control}
                            name="amount"
                            placeholder="Preço"
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                isActive={transactionType === 'positive'}
                                onPress={() => handleTransactionTypeSelect('positive')} />

                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                isActive={transactionType === 'negative'}
                                onPress={() => handleTransactionTypeSelect('negative')} />
                        </TransactionTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />

                    </Fields>

                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModal}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container >
        </TouchableWithoutFeedback>
    )
}