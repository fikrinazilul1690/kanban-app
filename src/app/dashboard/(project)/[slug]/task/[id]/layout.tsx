export default function LayoutTask({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
