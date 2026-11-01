"use client";

import { useState } from "react";
import type { MouseEventHandler, ReactNode, FormEvent } from "react";

type Friend = {
  id: number;
  name: string;
  image: string;
  balance: number;
};

const initialFriends: Friend[] = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function Home() {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  function OnAddFriend(friend: Friend) {
    setFriends((friends) => [...friends, friend]);
  };
  function HandelShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleSelection(friend: Friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value: number) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend?.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          onSelect={handleSelection}
          selected={selectedFriend}
          
        />
        {showAddFriend && <AddFriendForm onAddFriend={OnAddFriend} />}

        <Button onClick={HandelShowAddFriend}>
          {showAddFriend ? "close" : "Add FRIEND "}
        </Button>

      </div>
      {selectedFriend && (
        <SplitForm selected={selectedFriend} 
        onSplitBill={handleSplitBill}
         key={selectedFriend.id} />
      )}
    </div>
  );
}

export function Friends({
  friends,
  onSelect,
  selected,
}: {
  friends: Friend[];
  onSelect: (friend: Friend) => void;
  selected: Friend | null;
}) {
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <FriendList
            key={friend.id}
            friend={friend}
            onSelect={onSelect}
            selected={selected?.id === friend.id}
          />
        ))}
      </ul>
    </div>
  );
}

export function FriendList({
  friend,
  onSelect,
  selected,
}: {
  friend: Friend;
  onSelect: (friend: Friend) => void;
  selected: boolean;
}) {
  return (
    <li>
      <span>
        <img
          src={friend.image}
          alt={friend.name}
        />
      </span>
      <h3>{friend.name}</h3>
      {friend.balance < 0 &&
        (<p className="red">    you owes {friend.name} {Math.abs(friend.balance)}€</p>)}
      {friend.balance > 0 &&
        (<p className="green">  {friend.name} owes you {Math.abs(friend.balance)}€</p>)}
      {friend.balance === 0 &&
        (<p > You and {friend.name} are even</p>)}
      <Button onClick={() => onSelect(friend)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

export function AddFriendForm({ onAddFriend }: { onAddFriend: (friend: Friend) => void }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handelSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend: Friend = {
      id: Number(id.slice(0, 8)),
      name,
      image: `${image}?=${id}`,
      balance: 0
    }
    onAddFriend(newFriend);
    setName('');
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <div>
      <form className="form-add-friend" onSubmit={handelSubmit}>
        <label> Friend name :</label>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        <label>Image URL :</label>
        <input type="text" value={image} onChange={(event) => setImage(event.target.value)} />
        <Button>Add Friend</Button>
      </form>

    </div>
  );
}

export function SplitForm({ selected, onSplitBill }: { selected: Friend | null; onSplitBill: (value: number) => void }) {
  const friendName = selected?.name ?? "X";
  const [bill, setBill] = useState(Number(""));
  const [paidByUser, setPaidByUser] = useState(Number(""));
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill - paidByUser;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <div>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split a bill with {friendName}</h2>
        <label>💰 Bill value</label>
        <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
        <label>🧍‍♀️ Your expense</label>
        <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value))} />
        <label>👫 {friendName}'s expense</label>
        <input type="text" value={paidByFriend} disabled />
        <label>🤑 Who is paying the bill</label>
        <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
          <option value="user">YOU</option>
          <option value="friend">{friendName}</option>
        </select>
        <Button>Split bill</Button>
      </form>
    </div>
  );
}