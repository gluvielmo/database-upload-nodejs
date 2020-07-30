import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const transactions = await transactionsRepository.find();

    const balance = await transactionsRepository.getBalance(transactions);

    if (type === 'outcome') {
      if (value > balance.total) {
        throw new AppError(
          'Not balance enough to continue with this transaction',
        );
      }
    }

    const category = await categoryRepository.findOne({
      where: { category_id },
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
      category,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
