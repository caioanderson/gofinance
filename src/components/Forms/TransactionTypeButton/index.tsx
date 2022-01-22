import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Container, Title, Icon, Button } from './styles';

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
}

interface TransactionTypeButtonProps extends TouchableOpacityProps {
    title: string;
    type: 'up' | 'down';
    isActive: boolean;
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: TransactionTypeButtonProps) {
    return (
        <Container isActive={isActive} type={type} >
            <Button {...rest}>
                <Icon name={icons[type]} type={type} />
                <Title>{title}</Title>
            </Button>
        </Container>
    );
}