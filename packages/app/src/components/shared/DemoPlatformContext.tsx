import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { demoClusters, demoPersonas, demoTeamMembers, DemoPersona } from '../../data/demoData';

interface DemoPlatformContextValue {
  clusters: typeof demoClusters;
  personas: typeof demoPersonas;
  currentPersona: DemoPersona;
  teamMembers: typeof demoTeamMembers;
  setPersona: (personaId: string) => void;
}

const DemoPlatformContext = createContext<DemoPlatformContextValue | undefined>(undefined);

export const DemoPlatformProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentPersonaId, setCurrentPersonaId] = useState(demoPersonas[0].id);

  const value = useMemo<DemoPlatformContextValue>(() => {
    const currentPersona =
      demoPersonas.find(persona => persona.id === currentPersonaId) ?? demoPersonas[0];

    return {
      clusters: demoClusters,
      personas: demoPersonas,
      currentPersona,
      teamMembers: demoTeamMembers,
      setPersona: setCurrentPersonaId,
    };
  }, [currentPersonaId]);

  return (
    <DemoPlatformContext.Provider value={value}>
      {children}
    </DemoPlatformContext.Provider>
  );
};

export const useDemoPlatform = () => {
  const context = useContext(DemoPlatformContext);
  if (!context) {
    throw new Error('useDemoPlatform must be used within DemoPlatformProvider');
  }
  return context;
};
