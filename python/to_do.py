import tkinter as tk
from tkinter import messagebox

def add_task(event=None):
    task = task_entry.get().strip()
    if task:
        listbox.insert(tk.END, task)
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Warning", "Please enter a task.")

def delete_task():
    try:
        selected_task_index = listbox.curselection()[0]
        listbox.delete(selected_task_index)
    except IndexError:
        messagebox.showwarning("Warning", "Please select a task to delete.")

def mark_done():
    try:
        selected_task_index = listbox.curselection()[0]
        task = listbox.get(selected_task_index)
        if not task.startswith("[Done] "):
            listbox.delete(selected_task_index)
            listbox.insert(selected_task_index, "[Done] " + task)
            listbox.itemconfig(selected_task_index, {'fg': '#888888'})
    except IndexError:
        messagebox.showwarning("Warning", "Please select a task to mark as done.")

root = tk.Tk()
root.title("To-Do List")
root.geometry("400x520")
root.configure(bg="#f4f4f9")
root.resizable(False, False)

# Title
title_label = tk.Label(root, text="My Tasks", font=("Segoe UI", 24, "bold"), bg="#f4f4f9", fg="#333333")
title_label.pack(pady=20)

# Entry frame
entry_frame = tk.Frame(root, bg="#f4f4f9")
entry_frame.pack(pady=10)

task_entry = tk.Entry(entry_frame, width=22, font=("Segoe UI", 14), borderwidth=0, highlightthickness=1, highlightbackground="#cccccc")
task_entry.pack(side=tk.LEFT, padx=10, ipady=6)
task_entry.bind('<Return>', add_task)

add_button = tk.Button(entry_frame, text="Add", font=("Segoe UI", 12, "bold"), bg="#4CAF50", fg="white",
                       activebackground="#45a049", borderwidth=0, cursor="hand2", padx=20, pady=5, command=add_task)
add_button.pack(side=tk.LEFT)

# Listbox frame
list_frame = tk.Frame(root, bg="white", highlightthickness=1, highlightbackground="#cccccc")
list_frame.pack(pady=15, fill=tk.BOTH, expand=True, padx=30)

scrollbar = tk.Scrollbar(list_frame, borderwidth=0)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

listbox = tk.Listbox(list_frame, font=("Segoe UI", 12), borderwidth=0, highlightthickness=0,
                     selectbackground="#cfe2f3", selectforeground="black", yscrollcommand=scrollbar.set,
                     activestyle="none")
listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
scrollbar.config(command=listbox.yview)

# Buttons frame
btn_frame = tk.Frame(root, bg="#f4f4f9")
btn_frame.pack(pady=15, side=tk.BOTTOM)

done_btn = tk.Button(btn_frame, text="Mark as Done", font=("Segoe UI", 11, "bold"), bg="#2196F3", fg="white",
                     activebackground="#1e88e5", borderwidth=0, cursor="hand2", width=12, pady=8, command=mark_done)
done_btn.grid(row=0, column=0, padx=10)

delete_btn = tk.Button(btn_frame, text="Delete Task", font=("Segoe UI", 11, "bold"), bg="#f44336", fg="white",
                       activebackground="#e53935", borderwidth=0, cursor="hand2", width=12, pady=8, command=delete_task)
delete_btn.grid(row=0, column=1, padx=10)

root.mainloop()
