import { useOffline } from '../hooks/useOffline';

export const OfflineBanner = () => {
  const isOffline = useOffline();
  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-semibold sticky top-0 z-50">
      📡 オフラインモード — 保存済みデータは引き続き参照できます
    </div>
  );
};
