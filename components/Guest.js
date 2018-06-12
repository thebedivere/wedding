const Guest = ({handleGuestChange, guest}) => <div>
  {guest.members && guest.members.map(m => <input value={m} />)}
</div>

export default Guest
