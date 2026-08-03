import { useState, useEffect } from 'react';
import type { AcometidaVariante } from '../../domain/models/Acometida';
import { GetAcometidaCatalogUseCase } from '../../application/usecases/GetAcometidaCatalogUseCase';
import { AcometidaRepositoryImpl } from '../../infrastructure/repositories/AcometidaRepositoryImpl';

// Dependency injection container equivalent
// En una aplicación grande esto vendría de un Provider/Context de Inversión de Control.
const acometidaRepository = new AcometidaRepositoryImpl();
const getAcometidaCatalogUseCase = new GetAcometidaCatalogUseCase(acometidaRepository);

export const useAcometidasViewModel = () => {
  const [variants, setVariants] = useState<AcometidaVariante[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAcometidaCatalogUseCase.execute().then((data) => {
      setVariants(data);
      if (data.length > 0) setActiveId(data[0].id);
      setIsLoading(false);
    });
  }, []);

  const active = variants.find((v) => v.id === activeId);

  return {
    variants,
    activeId,
    active,
    isLoading,
    setActiveId
  };
};
