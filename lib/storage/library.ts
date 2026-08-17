import localforage from 'localforage';

export interface LibraryItem {
  id: string;
  title: string;
  blob: Blob;
  addedAt: number;
  lastRead: number;
  subject: string;
}

const libraryStore = localforage.createInstance({
  name: 'shikshasetu',
  storeName: 'pdf_library'
});

export const saveToLibrary = async (
  file: File,
  title: string,
  subject: string
): Promise<LibraryItem> => {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  const item: LibraryItem = {
    id,
    title,
    blob: file,
    addedAt: now,
    lastRead: now,
    subject: subject || 'Uncategorized',
  };

  await libraryStore.setItem(id, item);
  return item;
};

export const getLibrary = async (): Promise<LibraryItem[]> => {
  const items: LibraryItem[] = [];
  await libraryStore.iterate((value: LibraryItem) => {
    items.push(value);
  });
  return items.sort((a, b) => b.addedAt - a.addedAt);
};

export const updateLastRead = async (id: string): Promise<void> => {
  const item: LibraryItem | null = await libraryStore.getItem(id);
  if (item) {
    item.lastRead = Date.now();
    await libraryStore.setItem(id, item);
  }
};

export const removeFromLibrary = async (id: string): Promise<void> => {
  await libraryStore.removeItem(id);
};
