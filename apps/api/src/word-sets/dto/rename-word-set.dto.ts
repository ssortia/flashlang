import { CreateWordSetDto } from './create-word-set.dto';

// Семантически отдельный DTO для операции переименования,
// структурно идентичен CreateWordSetDto — используем наследование.
export class RenameWordSetDto extends CreateWordSetDto {}
