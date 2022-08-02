import { createContext } from 'react';

import LanguageType, * as Language from '@ts/Language';

export interface MoviesSearchContextType {
  language: LanguageType;
  darkModeEnabled: boolean;
  apiKey: string;
}

const MoviesSearchContext = createContext<MoviesSearchContextType>({
  language: Language.DEFAULT,
  darkModeEnabled: false,
  apiKey: '2ab87dbd3a5185ee9af24363729e47a9',
});

export default MoviesSearchContext;
