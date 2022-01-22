import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Input } from '../Forms/Input';
import { Container, Error } from './styles';

interface InputReactHookFormProps extends TextInputProps {
    control: Control;
    name: string;
    error: string;
}

export function InputReactHookForm({ control, name, error, ...rest }: InputReactHookFormProps) {
    return (
        <Container>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Input  {...rest}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
                name={name}
            />
            {error && <Error>{error}</Error>}
        </Container>
    )
}