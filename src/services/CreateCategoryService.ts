import { getCustomRepository } from 'typeorm';

// import Category from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<string> {
    const categoryRepository = getCustomRepository(CategoryRepository);

    const checkIfCategoryAlreadyExists = await categoryRepository.findByTitle(
      title,
    );

    if (checkIfCategoryAlreadyExists) {
      return checkIfCategoryAlreadyExists.id;
    }

    const category = categoryRepository.create({ title });

    await categoryRepository.save(category);

    return category.id;
  }
}

export default CreateCategoryService;
