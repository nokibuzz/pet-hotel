export async function DELETE(request, { params }) {
  const { userEmail } = await params;

  const user = prisma.user.delete({
    where: {
      email: userEmail,
    },
  });

  return NextResponse.json(user);
}
